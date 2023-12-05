// import {
//   PipeTransform,
//   Injectable,
//   ArgumentMetadata,
//   BadRequestException
// } from '@nestjs/common';
// import { isValidUUIDV4 } from 'is-valid-uuid-v4';
//
// @Injectable()
// export class UuidValidationPipe implements PipeTransform {
//   transform(value: any, metadata: ArgumentMetadata) {
//     if (
//       value.ids &&
//       Array.isArray(value.ids) &&
//       value.ids.some((maybeUuid) => !isValidUUIDV4(maybeUuid))
//     ) {
//       throw new BadRequestException(
//         'Validation failed. ids must be list of valid UUIDs.'
//       );
//     }
//     return value;
//   }
// }
